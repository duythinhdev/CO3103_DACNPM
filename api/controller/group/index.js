const GroupModel = require("../../models/Group")

exports.create = async(req, res) => {
    const {groupname, members} = req.body
    console.log(req.body.members)
    console.log(req.body.groupname)
    if (groupname == undefined || groupname.length < 3) {
        return res.status(500).json({'error': "group name should > 3 character"});
    }
    if (members == undefined || members.length <= 1) {
        return res.status(500).json({'error': "group should > 1 member"});
    }
    try {
        const groupCreated = await GroupModel.create({
            groupname: groupname,
            members: members
        })
        res.status(201).json({id: groupCreated._id})
    } catch(err) {
        if (err) throw err;
        res.status(500).json({'error': err});
    }
}