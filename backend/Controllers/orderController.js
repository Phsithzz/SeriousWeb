import * as orderService from "../Services/orderService.js";

export const getOrder = async (_req, res) =>
  res.status(200).json(await orderService.getOrder());
