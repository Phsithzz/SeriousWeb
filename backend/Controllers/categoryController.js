import * as clientService from "../Services/categoryService.js";

export const createClient = async (req, res) => {
  try {
    const clientData = req.body;
    const newclients = await clientService.createClient(clientData);
    res.status(200).json(newclients);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error createClient",
    });
  }
};