// Minimal icons needed for Isoflow functionality
// These are system icons that Isoflow uses internally

export const getMinimalIcons = (allIcons: any[]) => {
  // Find connector/arrow related icons that Isoflow might need
  const essentialIconIds = [
    'arrow',
    'connector',
    'line',
    'path',
    '_isoflow_', // Isoflow system icons
    'isoflow-arrow',
    'isoflow-connector'
  ];
  
  // Filter to only include essential system icons
  const minimalIcons = allIcons.filter(icon => {
    const id = icon.id?.toLowerCase() || '';
    return essentialIconIds.some(essential => id.includes(essential));
  });
  
  console.log(`Reduced icons from ${allIcons.length} to ${minimalIcons.length} essential icons`);
  
  // If no essential icons found, include at least the first few icons
  if (minimalIcons.length === 0 && allIcons.length > 0) {
    return allIcons.slice(0, 10); // Fallback to first 10 icons
  }
  
  return minimalIcons;
};