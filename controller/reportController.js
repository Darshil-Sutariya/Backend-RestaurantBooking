const Bill = require("../model/billModel");
const Table = require("../model/tableModel");

const getFullReport = async (req, res) => {
    try {

        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);


        const [dailySales, monthlySales, topItems, tableUsage] = await Promise.all([

            Bill.aggregate([
                { $match: { status: "closed", updatedAt: { $gte: startOfDay } } },
                { $group: { _id: null, revenue: { $sum: "$grandTotal" }, count: { $sum: 1 } } }
            ]),


            Bill.aggregate([
                { $match: { status: "closed", updatedAt: { $gte: startOfMonth } } },
                { $group: { _id: null, revenue: { $sum: "$grandTotal" }, count: { $sum: 1 } } }
            ]),


            Bill.aggregate([
                { $match: { status: "closed" } },
                { $unwind: "$items" },
                { $group: { 
                    _id: "$items.productName", 
                    totalQty: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.total" } 
                }},
                { $sort: { totalQty: -1 } },
                { $limit: 5 }
            ]),

            Bill.aggregate([
                { $group: { _id: "$table", ordersCount: { $sum: 1 } } },
                { $lookup: { from: "tables", localField: "_id", foreignField: "_id", as: "details" } },
                { $unwind: "$details" },
                { $project: { tableNumber: "$details.tableNumber", ordersCount: 1 } }
            ])
        ]);

        res.status(200).json({
            success: true,
            dashboard: {
                daily: dailySales[0] || { revenue: 0, count: 0 },
                monthly: monthlySales[0] || { revenue: 0, count: 0 },
                topSellingItems: topItems,
                tableUsage: tableUsage
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getFullReport };