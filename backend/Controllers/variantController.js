import * as variantService from "../Services/variantService.js"

export const createVariant = async (req, res) => {
  try {
    const variantData = req.body;
    const newvariant = await variantService.createVariant(variantData);
    res.status(201).json(newvariant);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error createVariant",
      error: err.message,
    });
  }
};

export const getVariant = async(req,res)=>{
    try {
        const variant = await variantService.getVariant()
        res.status(200).json(variant)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message:"Server error getVariant",
            error:err.message
        })
        
    }
}

export const updateVariant = async(req,res)=>{
    try {
        const variantId = req.params.id
        const variantData = req.body

        const updateVariant = await variantService.updateVariant(variantId,variantData)
        
        if(!updateVariant){
            return res.status(400).json({
                message:"Product Variant not Found"
            })
        }
        res.status(200).json(updateVariant)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message:"Server error updateVariant",
            error:err.message
        })
        
    }
}

export const deleteVariant = async(req,res)=>{
    try {
        const variantId = req.params.id
        const deleted = await variantService.deleteVariant(variantId)

        if(!deleted){
            return res.status(404).json({
                message:"Product Variant not Found"
            })
        }

        res.status(200).send("DELETED")

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message:"Server error deleteVariant",
            error:err.message
        })
        
    }
}