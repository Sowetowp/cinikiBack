import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class VendorAuthRepository {
  constructor() {
    this.model = prisma.vendor;
  }

  async create(data) {
    return await this.model.create({ data });
  }

  async findByEmail(email) {
    return await this.model.findUnique({ where: { email } });
  }

  async findByCode(code) {
    return await this.model.findUnique({ where: { referralCode: code } });
  }

  async updateReferrals(code) {
    return await this.model.updateMany({
      where: { referralCode: code },
      data: { referrals: { increment: 1 } }
    });
  }

  async findByEmailOrPhone(email, phoneNumber) {
    return await this.model.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });
  }
}

export default VendorAuthRepository;