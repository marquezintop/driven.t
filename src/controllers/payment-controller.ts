// import { Request, Response } from "express";
// import httpStatus from "http-status";

// export async function readPaymentById(req: Request, res: Response) {
//     const tickedId: number = Number(req.params.id);

//     if (!tickedId) return res.sendStatus(httpStatus.BAD_REQUEST);
//     try {
//         const payment = await paymentService.getPaymentById(tickedId);

//         res.send(payment).status(httpStatus.OK);
//     } catch (error) {
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
//     }
// }
