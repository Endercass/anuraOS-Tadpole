import { defs as elementDefs, js as elementjs } from "./element.js";
import { defs as proceduresDefs, js as proceduresjs } from "./procedures.js";
import { defs as esmDefs, js as esmjs } from "./esm.js";

export const defs = Object.assign({}, elementDefs, proceduresDefs, esmDefs);
export const js = Object.assign({}, elementjs, proceduresjs, esmjs);
