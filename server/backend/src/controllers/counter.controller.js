const counterManager = require('../utils/counterManager');

async function setupCounter(req, res, next) {
  try {
    const { counterId, entryId, formEntries } = req.body;
    if (!counterId || !entryId) {
      return res.status(400).json({ message: 'counterId and entryId required' });
    }

    const assigned = counterManager.assignEntryToCounter(counterId, {
      entryId,
      formEntries
    });

    return res.status(200).json({
      message: 'Entry assigned to counter',
      counter: assigned
    });
  } catch (err) {
    // if counter busy
    return res.status(409).json({ message: err.message });
  }
}

async function completeTransaction(req, res, next) {
  try {
    const { counterId } = req.body;
    if (!counterId) return res.status(400).json({ message: 'counterId required' });

    const { counter, finished } = counterManager.completeTransaction(counterId);


    return res.status(200).json({
      message: 'Transaction completed, counter is now vacant',
      counter,
      finished
    });
  } catch (err) {
    return res.status(409).json({ message: err.message });
  }
}

function getCounter(req, res) {
  const { counterId } = req.params;
  if (counterId) {
    const c = counterManager.getCounter(counterId);
    if (!c) return res.status(404).json({ message: 'Not found' });
    return res.json(c);
  }
  return res.json(counterManager.listCounters());
}

module.exports = {
  setupCounter,
  completeTransaction,
  getCounter
};