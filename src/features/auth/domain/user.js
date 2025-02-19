class User {
    constructor({ userId, firstName, email, password, lastName, address, phoneNumber, referralCode, referredBy, role, code }) {
        this.id = userId;
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.lastName = lastName;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.referralCode = referralCode;
        this.referredBy = referredBy;
        this.role = role;
        this.otp = code;
    }
}

export default User