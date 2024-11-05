const tokengenerater = require("../Jwttoken");
const UserModal = require("../Modals/UserModal");
const LoginAuth = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModal.findOne({ email });

        if (user && await user.comparepass(password)) {  
            res.json({
                message: 'Login successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    img: user.img,
                    profile: user.profile, 
                    number: user.number,
                    token: tokengenerater(user._id),
                }
            });
        } else {
            res.status(400).json({
                message: 'Invalid Information'
            });
        }

    } catch (error) {
        console.error(`Error in Login Backend: ${error}`);
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};


const RegisterAuth = async (req, res) => {
    try {
        const { name, email, password, profile,number } = req.body; 

        if (!name || !email || !password ||!number) {
            return res.status(400).json({
                message: 'Provide all fields'
            });
        }

        const alreadyExist = await UserModal.findOne({ email });
        if (alreadyExist) {
            return res.status(400).json({
                message: 'Already Have an Account'
            });
        }

        const user = await UserModal.create({
            name,
            email,
            password,
            
profile, 
            number
        });

        if (user) {
            res.status(200).json({
                message: "Account successfully created",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile: user.profile, 
                    number: user.number,
                    token: tokengenerater(user._id),
                }
            });
        } else {
            res.status(400).json({
                message: "Try again later"
            });
        }

    } catch (error) {
        console.error(`Error in Registration: ${error}`);
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};
const alluser = async (req, res) => {
    const searchQuery = req.query.search || "";

    let search = {};
    
    if (!isNaN(searchQuery)) {
        
        search = { number: searchQuery };
    } else {
        
        search = {
            $or: [
                { email: { $regex: searchQuery, $options: 'i' } }
            ]
        };
    }

    try {
        const users = await UserModal.find(search).find({ _id: { $ne: req.user._id } });
        res.send(users);
    } catch (error) {
        console.error("Error in fetching users: ", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { LoginAuth, RegisterAuth, alluser};
