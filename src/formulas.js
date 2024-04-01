class Formulas {
  DEFAULT_ATTRIBUTES = {
    maxHp: 250,
    hp: 250,
    maxMp: 50,
    mp: 50,
    maxAp: 7,
    ap: 7,
    gauge: 50,
    str: 9,
    dex: 7,
    res: 8,
    mag: 6,
    level: 1,
    equipLoad: 14.6
  };

  MODIFIABLES = {
    attack: 16,
    accuracy: 12,
    dodge: 11,
  }

  constructor(attributes, modifiables, hitFormula, hitResult) {
    this.attributes = attributes;
    this.modifiables = modifiables;
    this.hitFormula = hitFormula;
    this.hitResult = hitResult;
    this._attributes = { ...this.DEFAULT_ATTRIBUTES };
    this._modifiables = { ...this.MODIFIABLES };
    this._hitFormula = this.getHitFormula();
  }

  init() {
    this.attributes.value = JSON.stringify(this._attributes, null, ' ');
    this.modifiables.value = JSON.stringify(this._modifiables, null, ' ');
    this.hitFormula.value = this._hitFormula;
    this.refresh();

    this.hitFormula.onkeyup = () => {
      this.refresh();
    }
  }

  refresh() {
    for (const key of Object.keys(this._attributes)) {
      this[key] = this._attributes[key];
    }
    for (const key of Object.keys(this._modifiables)) {
      this[key] = this._modifiables[key];
    }

    this.setHitFormula();
  }

  getHitFormula() {
    return '100 + this.accuracy - this.dodge';
  }

  setHitFormula() {
    try {
      this.hitResult.innerHTML = this.evalInScope(this.hitFormula.value, this);
    } catch (err) {
      this.hitResult.innerHTML = err.message;
    }
  }

  evalInScope(js, context) {
    return function() {
      return eval(js);
    }.call(context);
  }
}

window.onload = function() {
  const formulas = new Formulas(
    document.getElementById('attributes'),
    document.getElementById('modifiables'),
    document.getElementById('hit-formula'),
    document.getElementById('hit-result'),
  );
  formulas.init();
}