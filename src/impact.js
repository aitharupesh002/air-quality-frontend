// What each air quality band means for people and for the landscape.
// Wording follows the US EPA AQI health messages and WHO guidance on
// air pollution; it is general education, not medical advice.

export const IMPACT = {
  good: {
    headline: "Clear air, long views.",
    summary: "Little or no risk to anyone.",
    body: [
      "Lungs and heart work without extra strain, even during hard exercise.",
      "No symptoms are expected for anyone, including children and people with asthma.",
      "Fine particles stay low, so there is nothing to build up in your lungs.",
    ],
    land: [
      "Distant hills stay sharp and visibility is at its best.",
      "Leaves, soil and water are under no pollution stress.",
      "Full sunlight reaches plants, so crops and forests grow at their natural pace.",
    ],
    act: [
      "Open the windows and let fresh air in.",
      "Good day for a run, a ride or a walk outside.",
      "Dry laundry outdoors; nothing will settle on it.",
    ],
  },
  moderate: {
    headline: "A soft haze, mostly fine.",
    summary: "Acceptable, but a few people may notice it.",
    body: [
      "Most people feel nothing at all.",
      "A few unusually sensitive people may cough or get a scratchy throat during long outdoor effort.",
      "People with asthma may need their inhaler slightly more often.",
    ],
    land: [
      "A thin haze softens the far hills.",
      "Ozone and fine dust begin to stress the most sensitive plants.",
      "Slightly less sunlight reaches the ground.",
    ],
    act: [
      "Normal outdoor plans are fine.",
      "If you are unusually sensitive, take breaks during long, hard exercise.",
      "Keep a reliever inhaler within reach if you have asthma.",
    ],
  },
  sensitive: {
    headline: "Fine for most, hard on some.",
    summary: "Sensitive groups may feel effects first.",
    body: [
      "Children, older adults, pregnant women and people with asthma, COPD or heart disease may get coughing, wheezing or chest tightness.",
      "Healthy adults are unlikely to notice much.",
      "Children are hit harder because their lungs are still growing and they breathe faster.",
    ],
    land: [
      "Orange haze hides the distant hills and visibility falls.",
      "Ground-level ozone and dust slow photosynthesis and can lower crop yields.",
      "Gases such as SO₂ and NO₂ can turn rain acidic over time, harming soil and lakes.",
    ],
    act: [
      "Sensitive groups: cut back on long or hard outdoor activity.",
      "Move heavy workouts indoors.",
      "Keep windows closed if you live beside a busy road.",
    ],
  },
  unhealthy: {
    headline: "Everyone starts to feel it.",
    summary: "Everyone may notice effects.",
    body: [
      "A scratchy throat, coughing, burning eyes and shortness of breath become common for everyone.",
      "Sensitive groups can have more serious problems, such as asthma attacks.",
      "Some fine particles (PM2.5) are small enough to pass from the lungs into the bloodstream and strain the heart.",
    ],
    land: [
      "Brown-grey smog blots out the hills; road, rail and air traffic slow down in poor visibility.",
      "Dust coating the leaves blocks light and clogs their pores, so plants grow less.",
      "Pollutants wash into rivers and lakes and upset the life in them.",
    ],
    act: [
      "Avoid long or heavy outdoor effort; sensitive groups should stay indoors.",
      "Wear a well-fitted N95 or FFP2 mask if you have to be outside.",
      "Run an air purifier or keep windows shut, and do not burn waste or wood.",
    ],
  },
  "very-unhealthy": {
    headline: "A health alert for everyone.",
    summary: "Serious effects are possible for everyone.",
    body: [
      "Everyone may have serious effects, from heavy coughing to chest pain.",
      "Breathing trouble and heart strain can begin within hours to days, not years.",
      "People with lung or heart disease may need emergency care.",
    ],
    land: [
      "The sun is a dull red disc and the sky stays gloomy at midday.",
      "Less sunlight and heavy particles slow crop growth, and harvests can shrink.",
      "Birds, pets and livestock breathe this air too and are affected.",
    ],
    act: [
      "Stay indoors with doors and windows closed.",
      "Skip outdoor exercise completely; schools should move activities inside.",
      "Use a purifier, and wear an N95 mask if you must step out.",
    ],
  },
  hazardous: {
    headline: "An emergency: stay indoors.",
    summary: "Emergency conditions; the whole population is likely affected.",
    body: [
      "Emergency conditions: everyone is likely to be affected.",
      "The risk of severe breathing trouble, heart attacks and strokes rises sharply, especially for older adults and people who are ill.",
      "Even healthy people can struggle to breathe during light activity.",
    ],
    land: [
      "Daylight dims to an orange-brown gloom and visibility drops sharply, grounding flights and slowing roads.",
      "Soot and dust coat leaves and rooftops; stressed crops and trees take much longer to recover.",
      "Settling ash and soot can contaminate soil and water.",
    ],
    act: [
      "Stay indoors and seal gaps around doors and windows.",
      "Avoid all outdoor activity and postpone travel if you can.",
      "Follow local authority advice, and get medical help for chest pain or hard breathing.",
    ],
  },
};

export const WEATHER_NOTE =
  "Weather decides how long bad air lasts. Cold, still mornings trap smog close to the ground (a temperature inversion). Wind and rain clear it away, while hot, sunny afternoons can build up ozone.";

export const LONG_TERM_NOTE =
  "One bad day is a warning. Breathing polluted air every day is what does lasting harm: weaker lungs in children, more heart disease and stroke, and shorter lives. The WHO links air pollution to millions of premature deaths each year.";
