import channelModel from "../models/channel.model.js";

export function createChannel(req, res) {
  const newChannel = new channelModel(req.body);
  newChannel
    .save()
    .then((data) => {
      if (!data) {
        return res.status(400).json({ message: "Somthing went wrong" });
      }
      res.json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export function fetchChannelById(req, res) {
    const _id = req.params.id
  channelModel
    .findOne({_id})
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "Channel not found" });
      }
      res.json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}
