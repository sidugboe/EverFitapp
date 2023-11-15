const router = require("express").Router();
const { getUploadURL } = require("../s3");
const auth = require("../auth");

router.get("/", auth, async (req, res) => {
    try {
        const url = await getUploadURL();

        return res.status(200).json({ url });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;