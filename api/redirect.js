export default function handler(req, res) {
  const rawTo = Array.isArray(req.query.to) ? req.query.to[0] : req.query.to;

  if (!rawTo) {
    res.status(400).send('Missing "to" parameter');
    return;
  }

  let result = rawTo;

  // Your logic exactly
  if (/^https?:\/\/ads\.luarmor\.net\//i.test(result)) {
    result = `http://camper.pythonanywhere.com/redirect?to=${result}`;
  }

  res.setHeader("Location", result);
  res.statusCode = 302;
  res.end();
}