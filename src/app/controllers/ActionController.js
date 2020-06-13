const Action = require('../models/Action');
const Yup = require('yup');

class ActionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      subtitle: Yup.string().required(),
      content: Yup.string().required(),
      image_url: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails!' });
    }

    try {
      const action = await Action.create(req.body);

      return res.json(action);
    } catch (error) {
      return res.status(400).json({ error: 'Error on create action!' });
    }
  }

  async index(req, res) {
    const actions = await Action.findAll();

    if (!actions) {
      return res.status(400).json({ error: 'No actions founded' });
    }

    return res.json(actions);
  }

  async show(req, res) {
    const { id } = req.params;
    const action = await Action.findByPk(id);

    if (!action) {
      return res.status(400).json({ error: 'Action not founded!' });
    }

    return res.json(action);
  }

  async update(req, res) {
    const { id } = req.params;

    try {
      const action = await Action.findByPk(id);

      const update = req.body;

      if (update.title) {
        action.title = update.title;
      }

      if (update.subtitle) {
        action.subtitle = update.subtitle;
      }

      if (update.content) {
        action.content = update.content;
      }

      if (update.image_url) {
        action.image_url = update.image_url;
      }

      action.save();

      return res.json(action);
    } catch (error) {
      return res.status(400).json({ error: 'Error on updating action!' });
    }
  }

  async destroy(req, res) {
    const { id } = req.params;

    try {
      const action = await Action.findByPk(id);

      action.destroy();

      return res.json({ success: 'Action successfuly deleted!' });
    } catch (e) {
      return res.status(400).json({ error: 'Action not founded!' });
    }
  }
}

module.exports = new ActionController();