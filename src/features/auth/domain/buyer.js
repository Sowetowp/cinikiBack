class Buyer {
    constructor({ firstName, email, password, lastName, address, phoneNumber, referralCode, referredBy }) {
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.lastName = lastName;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.referralCode = referralCode;
        this.referredBy = referredBy;
    }
}  

export default Buyer