import { state } from "../initialState.js";
import { GUI_GUTTER, GUI_OFFSET, paintProperties as p } from "../constants.js";

export const initGuiPanels = (s, thisContext) => {
  const gui = s.createGui("paintbrush", thisContext);
  gui.id = "paintbrush-options";
  gui.addObject(state.gui);

  const lfo1Gui = s.createGui("lfo1", thisContext);
  lfo1Gui.setPosition(GUI_OFFSET);
  lfo1Gui.addObject(state.lfo1.gui);

  const lfo2Gui = s.createGui("lfo2", thisContext);
  lfo2Gui.setPosition(2 * GUI_OFFSET - GUI_GUTTER);
  lfo2Gui.addObject(state.lfo2.gui);

  const lfo3Gui = s.createGui("lfo3", thisContext);
  lfo3Gui.setPosition(3 * GUI_OFFSET - 2 * GUI_GUTTER);
  lfo3Gui.addObject(state.lfo3.gui);

  handleVisibleParams();
  handleVisibleLfoParams(1);
  handleVisibleLfoParams(2);
  handleVisibleLfoParams(3);
  // lfos must be in the DOM to set up listeners, immediately close after init
  lfo1Gui.collapse();
  lfo2Gui.collapse();
  lfo3Gui.collapse();
};

const handleVisibleLfoParams = (lfoIndex) => {
  const colorOptions = ["saturation", "brightness"];
  // set initial visible params
  initLfoParams(colorOptions, lfoIndex);

  const fillColorToggle = document.querySelector(
    `#lfo${lfoIndex} .qs_content #${p.FILL_COLOR}`
  );
  const strokeColorToggle = document.querySelector(
    `#lfo${lfoIndex} .qs_content #${p.STROKE_COLOR}`
  );
  const toggles = [fillColorToggle, strokeColorToggle];

  const areColorOptionsSelected = [false, false];

  // add listeners to update visibility based on user changes
  toggles.forEach((toggle, idx) => {
    toggle.addEventListener("change", (e) => {
      const isOn = e.target.checked;
      areColorOptionsSelected[idx] = isOn;

      // if either of the color-based options are selected, show the saturation/brightness sliders
      if (areColorOptionsSelected.some((x) => x)) {
        colorOptions.forEach((option) => {
          const element = document.querySelector(
            `#lfo${lfoIndex} .qs_content #${option}`
          );
          element.style.display = "block";
        });
      } else {
        colorOptions.forEach((option) => {
          const element = document.querySelector(
            `#lfo${lfoIndex} .qs_content #${option}`
          );
          element.style.display = "none";
        });
      }
    });
  });
};

const initLfoParams = (colorOptions, lfoIndex) => {
  colorOptions.forEach((option) => {
    const element = document.querySelector(
      `#lfo${lfoIndex} .qs_content #${option}`
    );
    element.style.display = "none";
  });
};

const handleVisibleParams = () => {
  // conditionally hide irrevelant properties based on current shape selection
  const shapeSelector = document.querySelector("#shape");

  // initial configuration
  const selectElement = shapeSelector.querySelector("select");
  const currentSelection = selectElement.options[selectElement.selectedIndex];
  hideUnusedProperties(currentSelection.value);

  // update on changes to shape selection dropdown
  shapeSelector.addEventListener("change", (e) => {
    hideUnusedProperties(e.target.value);
  });
};

const hideUnusedProperties = (shape) => {
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
  }
};

const getUnusedParamsForShape = (shape) => {
  switch (shape) {
    case "line":
      return [p.FILL_COLOR, p.FILL_OPACITY, p.SIZE];
    default:
      return [];
  }
};

const setParamVisibility = (hideList) => {
  const ignore = [p.X, p.Y, p.PREV_X, p.PREV_Y];

  // all params minus ignored props
  const paintProperties = Object.values(p).filter(
    (prop) => !ignore.includes(prop)
  );

  // hide ununsed params
  hideList.forEach((property) => {
    document.querySelector(`#${property}`).style.display = "none";
  });

  // iterate array diff and set display to block
  const diff = paintProperties.filter((p) => !hideList.includes(p));

  // show used params
  diff.forEach((property) => {
    document.querySelector(`#${property}`).style.display = "block";
  });
};
