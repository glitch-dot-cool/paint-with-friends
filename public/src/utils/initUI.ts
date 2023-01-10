import { state } from "../initialState.js";
import { GUI_GUTTER, GUI_OFFSET, paintProperties as p } from "../constants.js";
import { BrushShape, PaintWithFriends } from "../../../types";

export const initGuiPanels = (s: PaintWithFriends) => {
  const gui = s.createGui("paintbrush", s);
  gui.id = "paintbrush-options";
  gui.addObject(state.gui);

  const lfo1Gui = s.createGui("lfo1", s);
  lfo1Gui.setPosition(GUI_OFFSET);
  lfo1Gui.addObject(state.lfo1.gui);

  const lfo2Gui = s.createGui("lfo2", s);
  lfo2Gui.setPosition(2 * GUI_OFFSET - GUI_GUTTER);
  lfo2Gui.addObject(state.lfo2.gui);

  const lfo3Gui = s.createGui("lfo3", s);
  lfo3Gui.setPosition(3 * GUI_OFFSET - 2 * GUI_GUTTER);
  lfo3Gui.addObject(state.lfo3.gui);

  handleVisibleParams();
  // lfos must be in the DOM to set up listeners, immediately close after init
  lfo1Gui.collapse();
  lfo2Gui.collapse();
  lfo3Gui.collapse();
};

const handleVisibleParams = () => {
  // conditionally hide irrevelant properties based on current shape selection
  const shapeSelector: HTMLSelectElement | null =
    document.querySelector("#shape");

  // initial configuration
  const selectElement = shapeSelector?.querySelector("select");
  const currentSelection = selectElement?.options[selectElement.selectedIndex];
  hideUnusedProperties(currentSelection?.value as BrushShape);

  // update on changes to shape selection dropdown
  shapeSelector?.addEventListener("change", (e) => {
    const value = (e.target as HTMLInputElement).value as BrushShape;
    hideUnusedProperties(value);
  });
};

const hideUnusedProperties = (shape: BrushShape) => {
  switch (shape) {
    case "line":
      setParamVisibility(getUnusedParamsForShape(shape));
      break;
    case "circle":
      setParamVisibility(getUnusedParamsForShape(shape));
      break;
    case "square":
      setParamVisibility(getUnusedParamsForShape(shape));
      break;
    case "text":
      setParamVisibility(getUnusedParamsForShape(shape));
      break;
  }
};

const getUnusedParamsForShape = (shape: BrushShape) => {
  switch (shape) {
    case "line":
      return [p.FILL_HUE, p.FILL_OPACITY, p.SIZE, p.TEXT];
    case "circle":
    case "square":
      return [p.TEXT];
    default:
      return [];
  }
};

const setParamVisibility = (hideList: string[]) => {
  const ignore = [p.X, p.Y, p.PREV_X, p.PREV_Y];

  // all params minus ignored props
  const paintProperties = Object.values(p).filter(
    (prop) => !ignore.includes(prop)
  );

  // hide ununsed params
  hideList.forEach((property) => {
    const element = document.querySelector<HTMLElement>(`#${property}`);
    if (element) element.style.display = "none";
  });

  // iterate array diff and set display to block
  const diff = paintProperties.filter((p) => !hideList.includes(p));

  // show used params
  diff.forEach((property) => {
    const element = document.querySelector<HTMLElement>(`#${property}`);
    if (element) element.style.display = "block";
  });
};
