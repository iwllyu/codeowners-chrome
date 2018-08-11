export function loadCodeownersContent(
  owner: string,
  repo: string,
): Promise<string> {
  return new Promise(function(resolve) {
    chrome.storage.sync.get("default_codeowners", ({default_codeowners}) => {
      resolve(default_codeowners);
    });
  });
}

export function getFilterPatterns(
  codeownersContent: string,
  owners: Array<string>,
): Array<string> {
  const parsed = parseCodeowners(codeownersContent);
  const ownedRows = filterRowsByOwned(parsed, owners);
  return ownedRows.map((row: Array<string>) => row[0]);
}

type ParsedCodeowners = Array<Array<string>>;

// Return an array of [gitignorePattern, ...owners]
function parseCodeowners(codeownersContent: string): ParsedCodeowners {
  if (!codeownersContent) {
    return [];
  }
  return codeownersContent
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0 && line[0] !== "#")
    .map(line => line.split(/\s+/));
}

// Filters the parsed codeowners down to the rows that match owners
function filterRowsByOwned(
  codeownerRows: ParsedCodeowners,
  owners: Array<string>,
): ParsedCodeowners {
  return codeownerRows.filter(row =>
    row.slice(1).some(name => owners.includes(name)),
  );
}