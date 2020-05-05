
export function calculateNumberOfFiltersActive({
  projects, types, dateSetByUser, certified, owners
}, myLibrary) {
  let result = 0;
  if (!myLibrary) {
    result = projects && projects.length > 0 ? result + 1 : result;
    result = types && types.length > 0 ? result + 1 : result;
  }
  result = dateSetByUser ? result + 1 : result;
  result = certified ? result + 1 : result;
  result = owners && owners.length > 0 ? result + 1 : result;
  console.log(owners);
  return result;
}
