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

    // add thought to user
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
},

 // add reaction to thought
 addReaction({ params, body }, res) {
  Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $push: { reactions: body } },
    { new: true, runValidators: true }
  )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
},

 // update thought by id
 updateThought({ params, body }, res) {
  Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
},

 // remove thought
 removeThought({ params }, res) {
  Thought.findOneAndDelete({ _id: params.thoughtId })
    .then(deletedThought => {
      if (!deletedThought) {
        res.status(404).json({ message: 'No thought found with this id!' });
      }
      return User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { thoughts: params.thoughtId } },
        { new: true }
      );
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

  // remove reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId} } },
      { new: true }
    )
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.json(err));
  }
  };

module.exports = thoughtController;