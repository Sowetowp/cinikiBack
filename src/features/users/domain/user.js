class User {
    constructor({ id, firstName, email, password, lastName, address, phoneNumber }) {
        this.id = id;
        this.firstName = firstName;
        this.email = email;
        this.password = password;
        this.lastName = lastName;
        this.address = address;
        this.phoneNumber = phoneNumber;
    }
}

export default User