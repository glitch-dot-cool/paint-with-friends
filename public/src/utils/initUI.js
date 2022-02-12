import { state } from "../initialState.js";
import { GUI_GUTTER, GUI_OFFSET } from "../constants.js";

export const initGuiPanels = (s, thisContext) => {
  const gui = s.createGui("paintbrush", thisContext);
  gui.id = "paintbrush-options";
  gui.addObject(state.gui);

  const lfo1Gui = s.createGui("lfo1", thisContext);
  lfo1Gui.setPosition(GUI_OFFSET);
  lfo1Gui.addObject(state.lfo1.gui);
  lfo1Gui.collapse();

  const lfo2Gui = s.createGui("lfo2", thisContext);
  lfo2Gui.setPosition(2 * GUI_OFFSET - GUI_GUTTER);
  lfo2Gui.addObject(state.lfo2.gui);
  lfo2Gui.collapse();

  const lfo3Gui = s.createGui("lfo3", thisContext);
  lfo3Gui.setPosition(3 * GUI_OFFSET - 2 * GUI_GUTTER);
  lfo3Gui.addObject(state.lfo3.gui);
  lfo3Gui.collapse();
};
