const Action = require('../models/Action');
const User = require('../models/User');
const Yup = require('yup');

class ActionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      urlImg: Yup.string(),
      category_ref: Yup.string(),
      fullName: Yup.string().required(),
      institution: Yup.string().required(),
      email: Yup.string().required(),

      initialDate: Yup.date().required(),
      finalDate: Yup.date().required(),

      title: Yup.string().required(),
      subtitle: Yup.string().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails!' });
    }

    const {
      urlImg,
      category_ref,
      fullName,
      institution,
      email,

      initialDate,
      finalDate,

      title,
      subtitle,
      description,
    } = req.body;

    const existsTitle = await Action.findOne({ title });

    if (existsTitle)
      return res
        .status(400)
        .json({ message: 'Title already exists, try other title' });

    try {
      const action = await Action.create({
        urlImg,
        category_ref,
        fullName,
        institution,
        email,

        initialDate,
        finalDate,

        title,
        subtitle,
        description,
      });

      await action.save();

      return res.json(action);
    } catch (error) {
      return res.status(400).json({ error: 'Error on create action!' });
    }
  }

  async index(req, res) {
    const actions = await Action.find();
    if (!actions) {
      return res.status(400).json({ error: 'No actions founded' });
    }

    return res.status(200).json({ actions });
  }

  async show(req, res) {
    const { title } = req.query;
    if (!title) return res.status(400).json({ message: 'Title not provided' });
    const titleRefactored = title.replace(/_/gi, ' ');
    const action = await Action.findOne({ title: { $eq: titleRefactored } });

    if (!action) {
      return res.status(400).json({ error: 'Action not founded!' });
    }

    return res.json({ action });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      urlImg: Yup.string(),
      category_ref: Yup.string(),
      fullName: Yup.string(),
      institution: Yup.string(),
      email: Yup.string(),

      initialDate: Yup.date(),
      finalDate: Yup.date(),

      title: Yup.string(),
      subtitle: Yup.string(),
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails!' });
    }
    const { title } = req.query;
    if (!title) return res.status(400).json({ message: 'Title not provided' });
    const titleRefactored = title.replace(/_/gi, ' ');

    const action = Action.findOne({ title: titleRefactored });

    if (!action) {
      return res.status(400).json({ message: 'Action not found' });
    }
    action.set(req.body);
    await action.updateOne();
    return res.json({ message: 'Success' });
  }

  async destroy(req, res) {
    const { title } = req.query;
    if (!title) return res.status(400).json({ message: 'Title not provided' });
    const titleRefactored = title.replace(/_/gi, ' ');

    if (!title) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    try {
      const action = await Action.findOne({ title: titleRefactored });

      action.remove();

      return res.json({ success: 'Action successfuly deleted!' });
    } catch (e) {
      return res.status(400).json({ error: 'Action not founded!' });
    }
  }
}

module.exports = new ActionController();
