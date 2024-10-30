interface Rule {
  nonTerminal: string;
  productions: string[];
}

export const inGrammatic = (rules: Rule[], initialProductions: string[], maxLength: number): string[] => {
  let terminalStrings: string[] = [];

  const findRule = (nonterminal: string): string[] => {
    const rule = rules.find(r => r.nonTerminal === nonterminal);
    return rule ? rule.productions : [];
  };

  const expand = (str: string): string[] => {
    if (str.length > maxLength) {
      return [];
    }

    if (!str.match(/[A-Z]/)) {
      return [str];
    }

    let expandedStrings: string[] = [];

    for (let i = 0; i < str.length; i++) {
      if (str[i].match(/[A-Z]/)) {
        const nonterminal = str[i];
        const before = str.slice(0, i);
        const after = str.slice(i + 1);

        const newChildren = findRule(nonterminal);

        newChildren.forEach(child => {
          expandedStrings.push(...expand(before + child + after));
        });

        break;
      }
    }

    return expandedStrings;
  };

  initialProductions.forEach(child => {
    terminalStrings.push(...expand(child));
  });

  return [...new Set(terminalStrings)].sort();
};