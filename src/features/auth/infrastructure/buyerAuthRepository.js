import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class BuyerAuthRepository {
  constructor() {
    this.model = prisma.buyer;
  }

  async createBuyer(data) {
    return await this.model.create({ data });
  }

  async findUserByEmail(email) {
    return await this.model.findUnique({ where: { email } });
  }

  async findUserByCode(code) {
    return await this.model.findUnique({ where: { referralCode: code } });
  }

  async updateReferrals(code) {
    return await this.model.updateMany({
      where: { referralCode: code },
      data: { referrals: { increment: 1 } }
    });
  }

  async findUserByEmailOrPhone(email, phoneNumber) {
    return await this.model.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });
  }
}

export default BuyerAuthRepository;