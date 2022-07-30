const { Thought, User } = require('../models');

const thoughtController = {

    // get all thoughts
    getAllThought(req, res) {
        Thought.find({})
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
      },

   // get one thoughts by id
    getThoughtById({ params }, res) {
     Thought.findOne({ _id: params.id })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

    // add comment to pizza
    addThought({ body }, res) {
      Thought.create(body)
        .then( dbThoughtData => {
            User.findOneAndUpdate(
                {_id: body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            )
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json({dbUserData, dbThoughtData});
        })
        .catch(err => res.json(err));
    });
}
  };

module.exports = thoughtController;