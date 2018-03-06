import { isArray } from '../predicate';
import { Ast } from './ast';
import parser from './grammar/default_syntax';

const unescapeValue = (value) => {
  return value.replace(/\\([:\-\\])/, '$1');
};

const escapeValue = (value) => {
  return value.replace(/([:\-\\])/, '\\$1');
};

const printValue = (value) => {
  if (value.match(/\s/)) {
    return `"${escapeValue(value)}"`;
  }
  return escapeValue(value);
};

export const defaultSyntax = Object.freeze({

  parse: (query) => {
    const clauses = parser.parse(query, { Ast, unescapeValue });
    return Ast.create(clauses);
  },

  print: (ast) => {
    return ast.clauses.reduce((text, clause) => {
      const prefix = Ast.Match.isMustClause(clause) ? '' : '-';
      switch (clause.type) {
        case Ast.Field.TYPE:
          if (isArray(clause.value)) {
            return `${text} ${prefix}${escapeValue(clause.field)}:(${clause.value.map(val => printValue(val)).join(' or ')})`;
          }
          return `${text} ${prefix}${escapeValue(clause.field)}:${printValue(clause.value)}`;
        case Ast.Is.TYPE:
          return `${text} ${prefix}is:${escapeValue(clause.flag)}`;
        case Ast.Term.TYPE:
          return `${text} ${prefix}${printValue(clause.value)}`;
        default:
          return text;
      }
    }, '').trim();
  }

});
