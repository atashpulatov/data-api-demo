
function calculateNumberOfFiltersActive(envFilter, myLibrary) {
  let result = 0;
  if (!myLibrary) {
    result = envFilter.certified ? result + 1 : result;
    result = envFilter.types.length > 0 ? result + 1 : result;
  }
  result = envFilter.dateSetByUser ? result + 1 : result;
  result = envFilter.owners.length > 0 ? result + 1 : result;
  result = envFilter.projects.length > 0 ? result + 1 : result;
  return result;
}
