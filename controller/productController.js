const productModel = require('../model/productModel');

const productView = async (req, res) => {
    try {

        const getProductData = await productModel.find().populate('category');
        console.log("getProductData ::", getProductData);
        
        if (getProductData.length === 0) {
            return res.send({ message: "Product is not found" });
        } else {
            return res.send({ message: "product details", data: getProductData });
        }

    } catch (error) {
        console.log(error);
        return res.send({ message: error.message, success: false })
    }

}

const productRegister = async (req, res) => {
    try {
        const {
            productname,
            productdiscription,
            productprice,
            productimage,
            category
        } = req.body;

        if (!productname || !productdiscription || !productprice || !productimage || !category) {
            return res.send({
                message: "please fill all the details",
                success: false
            });
        }

        const checkexistproduct = await productModel.findOne({ productname });

        if (checkexistproduct) {
            return res.send({
                message: "product is already exist",
                success: false
            });
        }

        const newproduct = new productModel({
            productname,
            productdiscription,
            productprice,
            productimage,
            category,
            createdBy: req.user.id
        });

        await newproduct.save();

        return res.send({
            message: "new product created",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.send({
            message: error.message,
            success: false
        });
    }
};

const productFind = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.send({ success: false, message: "product not found" });
    }

    return res.send({ success: true, data: product });

  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};


const updateproduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await productModel.findByIdAndUpdate(
            productId, {
            ...req.body,
            updatedAt: new Date(),
            updatedBy: req.user._id || req.user.id

        },
            { new: true }
        );

        if (!product) {
            return res.send({
                success: false,
                message: "product not found"
            });
        }

        res.send({
            success: true,
            message: "product updated successfully",
            product
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
}


const deleteproduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findByIdAndUpdate(
      productId,
      {
        deletedAt: new Date(),
        deletedBy: req.user.id
      },
      { new: true }
    );

    if (!product) {
      return res.send({
        success: false,
        message: "product not found"
      });
    }

    res.send({
      success: true,
      message: "product deleted successfully",
      product
    });

  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
    productView,
    productRegister,
    productFind,
    updateproduct,
    deleteproduct
}
