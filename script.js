const display = document.getElementById('display');

const MAX_DIGITS = 15;
const OPS = { add: '+', subtract: '-', multiply: '*', divide: '/' };
const GLYPH = { '-': '−', '*': '×', '/': '÷' };

let expr = '';
let justEvaluated = false;
let error = false;

function show() {
  const text = error ? 'Error' : (expr === '' ? '0' : expr);
  display.textContent = text.replace(/[-*/]/g, (c) => GLYPH[c]);
}

function clearAll() {
  expr = '';
  justEvaluated = false;
  error = false;
}

function tail(re = /\d*\.?\d*$/) {
  const m = expr.match(re);
  return m ? m[0] : '';
}

function inputDigit(d) {
  if (error) return;
  if (justEvaluated) { expr = ''; justEvaluated = false; }
  if (/[-+*/]$/.test(expr)) expr += '0';
  if (tail(/\d+$/).length >= MAX_DIGITS) return;
  if (/(^|[-+*/])-?0$/.test(expr) && !expr.endsWith('.')) expr = expr.slice(0, -1) + d;
  else if (expr === '0') expr = d;
  else expr += d;
}

function inputDecimal() {
  if (error) return;
  if (justEvaluated) { expr = ''; justEvaluated = false; }
  const num = tail();
  if (num.includes('.')) return;
  expr += num === '' ? '0.' : '.';
}

function chooseOperator(op) {
  if (error) return;
  justEvaluated = false;
  const symbol = OPS[op];
  if (expr === '' && symbol !== '-') return;
  const last = expr.slice(-1);
  if ('+-*/'.includes(last)) expr = expr.slice(0, -1) + symbol;
  else expr += symbol;
}

function negate() {
  if (error) return;
  if (expr === '' || justEvaluated) { expr = '0'; justEvaluated = false; }

  const num = tail(/\d*\.?\d+$/);
  if (num === '') { expr += '-0'; return; }
  const head = expr.slice(0, -num.length);

  if (head.endsWith('-')) expr = head.slice(0, -1) + num;
  else if (num === '0') expr = head + '-0';
  else expr = head + '-' + num;
}

function percent() {
  if (error) return;
  if (justEvaluated) return;
  const num = tail(/\d*\.?\d+$/);
  if (num === '') return;
  expr = expr.slice(0, -num.length) + String(parseFloat(num) / 100);
}

function backspace() {
  if (error || justEvaluated) { clearAll(); return; }
  expr = expr.slice(0, -1);
}

function calculate(src) {
  const parts = src.match(/\d*\.?\d+|[+\-*/]/g);
  if (!parts) return NaN;

  let i = 0;
  const factor = () => {
    let sign = 1;
    while (parts[i] === '+' || parts[i] === '-') {
      if (parts[i] === '-') sign = -sign;
      i++;
    }
    const t = parts[i++];
    if (t === undefined || '+-*/'.includes(t)) throw new Error('bad');
    return sign * parseFloat(t);
  };
  const term = () => {
    let left = factor();
    while (parts[i] === '*' || parts[i] === '/') {
      const op = parts[i++];
      const right = factor();
      if (op === '/' && right === 0) return NaN;
      left = op === '*' ? left * right : left / right;
    }
    return left;
  };
  const sum = () => {
    let left = term();
    while (parts[i] === '+' || parts[i] === '-') {
      const op = parts[i++];
      const right = term();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  };

  const value = sum();
  if (i !== parts.length) return NaN;
  return value;
}

function evaluate() {
  if (error) return;
  const src = expr.replace(/[-+*/]+$/, '');
  if (src === '' || src === '-') return;

  const value = calculate(src);
  if (!Number.isFinite(value)) { error = true; return; }

  expr = formatValue(value);
  justEvaluated = true;
}

function formatValue(value) {
  if (Number.isSafeInteger(value)) return String(value);
  return String(parseFloat(value.toPrecision(15)));
}

function act(num, action) {
  if (num !== undefined) { inputDigit(num); return; }
  if (action === 'decimal') inputDecimal();
  else if (action === 'clear') clearAll();
  else if (action === 'negate') negate();
  else if (action === 'percent') percent();
  else if (action === 'equals') evaluate();
  else if (OPS[action]) chooseOperator(action);
}

document.querySelector('.keys').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  act(btn.dataset.num, btn.dataset.action);
  show();
});

window.addEventListener('keydown', (e) => {
  const k = e.key;
  if (k >= '0' && k <= '9') inputDigit(k);
  else if (k === '.' || k === ',') inputDecimal();
  else if (k === '+') chooseOperator('add');
  else if (k === '-') chooseOperator('subtract');
  else if (k === '*' || k.toLowerCase() === 'x') chooseOperator('multiply');
  else if (k === '/') { e.preventDefault(); chooseOperator('divide'); }
  else if (k === 'Enter' || k === '=') evaluate();
  else if (k === 'Backspace') backspace();
  else if (k === 'Escape' || k === 'Delete') clearAll();
  else if (k === '%') percent();
  else if (k.toLowerCase() === 'n') negate();
  else return;
  show();
});

show();
