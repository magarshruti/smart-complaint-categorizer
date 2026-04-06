// ================================================================
// Similar Complaint Detection Engine
// ================================================================

// Simple token-based similarity using Jaccard index
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

function jaccardSimilarity(a, b) {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

// Find similar complaints and group them
export function findSimilarComplaints(complaints, threshold = 0.35) {
  const groups = [];
  const assigned = new Set();

  for (let i = 0; i < complaints.length; i++) {
    if (assigned.has(complaints[i].id)) continue;

    const group = [complaints[i]];
    assigned.add(complaints[i].id);

    for (let j = i + 1; j < complaints.length; j++) {
      if (assigned.has(complaints[j].id)) continue;

      // Check text similarity
      const textSim = jaccardSimilarity(
        `${complaints[i].title} ${complaints[i].description}`,
        `${complaints[j].title} ${complaints[j].description}`
      );

      // Boost if same area + subCategory
      const areaMatch = complaints[i].area === complaints[j].area ? 0.15 : 0;
      const subMatch = complaints[i].subCategory === complaints[j].subCategory ? 0.2 : 0;

      const totalSim = textSim + areaMatch + subMatch;

      if (totalSim >= threshold) {
        group.push(complaints[j]);
        assigned.add(complaints[j].id);
      }
    }

    if (group.length > 1) {
      groups.push({
        id: `group-${group[0].id}`,
        primaryComplaint: group[0],
        linkedComplaints: group,
        count: group.length,
        area: group[0].area,
        subCategory: group[0].subCategory,
        category: group[0].category,
        // Highest priority in group wins
        priority: group.some(c => c.priority === 'high') ? 'high'
          : group.some(c => c.priority === 'medium') ? 'medium' : 'low',
      });
    }
  }

  return groups;
}

// Get a human-readable summary for a complaint group
export function getGroupSummary(group) {
  const { count, area, subCategory, category } = group;
  return `${count} similar complaints about "${subCategory}" in ${area} (${category})`;
}
