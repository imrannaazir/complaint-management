import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import TicketServices from './services';

const createTicket = catchAsync(async (req, res) => {
  const payload = req.body;
  const userId = req.user?.id;
  const result = await TicketServices.createTicket(payload, userId!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'New ticket has been created.',
    data: result,
  });
});
const updateTicket = catchAsync(async (req, res) => {
  const ticketId = req.params.ticketId;
  const userId = req.user?.id;
  const payload = req.body;
  const result = await TicketServices.updateTicket(payload, ticketId, userId!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Ticket has been updated',
    data: result,
  });
});
const deleteTicket = catchAsync(async (req, res) => {
  const ticketId = req.params.ticketId;
  const userId = req.user?.id;
  const result = await TicketServices.deleteTicket(ticketId, userId!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Ticket has been deleted.',
    data: result,
  });
});
const getSingleTicket = catchAsync(async (req, res) => {
  const ticketId = req.params.ticketId;
  const user = req.user;
  const result = await TicketServices.getSingleTicket(ticketId, user!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Ticket has been retrieved successfully.',
    data: result,
  });
});

const TicketControllers = {
  createTicket,
  updateTicket,
  deleteTicket,
  getSingleTicket,
};
export default TicketControllers;
