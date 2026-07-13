const fs = require("fs");
const path = require("path");
const { classifyGarment } = require("../app/src/classifier");

const testSetPath = path.join(__dirname, "labeled-test-set.json");
const testSet = JSON.parse(fs.readFileSync(testSetPath, "utf-8"));

const fields = ["garmentType", "style", "material", "occasion"];
const scores = {};

for (const field of fields) {
  scores[field] = { correct: 0, total: 0 };
}

const results = testSet.map((item) => {
  const predicted = classifyGarment({ fileName: item.fileName });

  for (const field of fields) {
    scores[field].total += 1;
    if (predicted[field] === item.expected[field]) {
      scores[field].correct += 1;
    }
  }

  return {
    imageId: item.imageId,
    fileName: item.fileName,
    expected: item.expected,
    predicted: {
      garmentType: predicted.garmentType,
      style: predicted.style,
      material: predicted.material,
      occasion: predicted.occasion
    }
  };
});

const summary = {};
for (const field of fields) {
  const score = scores[field];
  summary[field] = {
    correct: score.correct,
    total: score.total,
    accuracy: Number((score.correct / score.total).toFixed(2))
  };
}

console.log("Evaluation summary:");
console.table(summary);

const outputPath = path.join(__dirname, "evaluation-results.json");
fs.writeFileSync(outputPath, JSON.stringify({ summary, results }, null, 2));
console.log(`Saved detailed results to ${outputPath}`);
