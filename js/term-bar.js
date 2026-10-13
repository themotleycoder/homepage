// Mobile dropdown for the shared terminal header bar (.term-bar)
(function () {
  var bar = document.querySelector('.term-bar');
  if (!bar) return;
  var btn = bar.querySelector('.term-toggle');
  if (!btn) return;

  function setOpen(open) {
    bar.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!bar.classList.contains('open'));
  });
  document.addEventListener('click', function (e) {
    if (!bar.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', function () { setOpen(false); });
})();
