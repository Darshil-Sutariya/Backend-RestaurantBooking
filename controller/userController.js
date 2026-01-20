const userModel = require('../model/userModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const Login = async (req, res) => {
  try {
    const { email, phonenumber, password } = req.body;

    // ✅ 1. Proper validation
    if ((!email && !phonenumber) || !password) {
      return res.send({
        success: false,
        message: "Email or phone number and password are required"
      });
    }

    let checkExistuser;

    // ✅ 2. Decide login type safely
    if (email) {
      checkExistuser = await userModel.findOne({
        email,
        deletedAt: null
      });
    } else {
      checkExistuser = await userModel.findOne({
        phonenumber,
        deletedAt: null
      });
    }

    // ✅ 3. User exists?
    if (!checkExistuser) {
      return res.send({
        success: false,
        message: "User does not exist"
      });
    }

    // ✅ 4. Password check
    const isMatch = await bcrypt.compare(password, checkExistuser.password);

    if (!isMatch) {
      return res.send({
        success: false,
        message: "Password is incorrect"
      });
    }

    // ✅ 5. Token
    const token = jwt.sign(
      { id: checkExistuser._id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    return res.send({
      success: true,
      message: "User login successfully",
      token,
      firstname: checkExistuser.firstname
    });

  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: error.message
    });
  }
};


const Signup = async (req, res) => {
  try {

    const { firstname, middlename, lastname, city, hotelname, address, email, phonenumber, password } = req.body;

    if (!firstname || !middlename || !lastname || !city || !hotelname || !address ||!email || !phonenumber || !password) {
      return res.send({ message: "pls fill all the details", success: false });
    }

    const checkExistuser = await userModel.findOne({ email });

    if (checkExistuser) {
      return res.send({ message: "user already exist", success: false })
    }

    const salt = await bcrypt.genSalt(10)

    const hashpassword = await bcrypt.hash(password, salt);

    const newuser = new userModel({
      firstname,
      middlename,
      lastname,
      city,
      hotelname,
      address,
      phonenumber,
      email,
      password: hashpassword
    })


    newuser.createdBy = newuser._id;
    await newuser.save();


    const token = await jwt.sign({ id: newuser._id }, process.env.TOKEN_SECRET)

    console.log(token)


    if (!token) {
      return res.send({ message: "token is not created", success: false })
    }

    return res.cookie("token", token, {
      httpOnly: true
    }).send({ message: "user created successfully", success: true })



  } catch (error) {
    console.log(error);
    return res.send({ message: error.message, success: false })
  }

}


const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        deletedAt: new Date(),
        deletedBy: req.user._id
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const updateData = {
      ...req.body,
     updatedBy: req.user.id,
      updatedAt: new Date()
    };

    delete updateData.password;

    const user = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.send({
        success: false,
        message: "User not found"
      });
    }

    res.send({
      success: true,
      message: "User updated successfully",
      user
    });

  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
};



module.exports = {
  Login,
  Signup,
  deleteUser,
  updateUser
}

