import { Ticket, User } from '@prisma/client';
import httpStatus from 'http-status';
import AppError from '../../../errors/appError';
import prisma from '../../../shared/prisma';
import { TCreateTicket } from './types';

const createTicket = async (
  payload: TCreateTicket,
  userId: string,
): Promise<Ticket> => {
  const { description, subject } = payload;
  const admin = await prisma.user.findFirstOrThrow({
    where: {
      role: 'ADMIN',
    },
  });

  const ticket = await prisma.ticket.create({
    data: {
      description,
      subject,
      customerId: userId,
      executiveId: admin.id,
    },
  });

  return ticket;
};

const updateTicket = async (
  payload: TCreateTicket,
  ticketId: string,
  userId: string,
): Promise<Ticket> => {
  const ticket = await prisma.ticket.findFirstOrThrow({
    where: {
      id: ticketId,
      customerId: userId,
    },
  });

  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticket.id,
    },
    data: {
      ...payload,
    },
  });

  return updatedTicket;
};

const deleteTicket = async (
  ticketId: string,
  userId: string,
): Promise<Ticket> => {
  const ticket = await prisma.ticket.findFirstOrThrow({
    where: {
      id: ticketId,
      customerId: userId,
    },
  });

  const deletedTicket = await prisma.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  return deletedTicket;
};

const getSingleTicket = async (ticketId: string, user: User) => {
  const ticket = await prisma.ticket.findFirstOrThrow({
    where: {
      id: ticketId,
    },
    include: {
      customer: true,
      executive: true,
    },
  });

  if (user.role === 'CUSTOMER' && user.id !== ticket.customerId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Access forbidden.');
  }

  return ticket;
};

const TicketServices = {
  createTicket,
  updateTicket,
  deleteTicket,
  getSingleTicket,
};
export default TicketServices;
