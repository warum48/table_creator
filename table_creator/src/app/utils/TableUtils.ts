export const TableUtils = {
    getAnyUniqueValues: (data: any[], field: string) => 
        [...new Set<string>(data.map((item:any) => field.split('.').reduce((o, i) => o?.[i], item)))],
    getUniqueValues: <T>(data: T[], field: string): string[] => {
        return [...new Set<string>(
          data.map(item =>
            field.split('.').reduce((o, i) => (o as any)?.[i], item as any)
          )
        )];
      },
      getNestedValue : (obj: any, path: string) => {
        return path.split(".").reduce((acc, part) => acc && acc[part], obj);
      },
      //use this function for complex objects with array and special sympols
      
      getComplexNestedValue : (obj: any, path: string) => {
        const regex = /(?:\["([^"]+)"\]|\['([^']+)'\]|\.?([^\.\[\]]+))/g;
        let match;
        let result = obj;
      
        while ((match = regex.exec(path)) !== null) {
          const key = match[1] || match[2] || match[3];
          result = result ? result[key] : undefined;
        }
      
        return result;
      }
}


const testData ={ "contacts": [
  {
    "Мобильный телефон": "+7 (985) 186-35-64"
  },
  {
    "Эл. почта": "nikitaatamanuk21@gmail.com"
  }
]
}
console.log('eeeeeeeeeemail', TableUtils.getComplexNestedValue(testData, 'contacts[1]["Эл. почта"]'));

//!!-------------getComplexNestedValues explanation ---------------*/
/*
Explanation
Regex Pattern: The regex pattern matches:

Keys within ["..."] or ['...'] brackets
Keys prefixed by dots (.)
Plain keys without special brackets or quotes
Iterating Through Path: We use a while loop with regex.exec(path) to parse each segment of the path.

Accessing Each Key: For each match, match[1], match[2], or match[3] extracts the relevant key, accounting for different formats ("key", 'key', and key).
*/
/*
      const testData = {
  "contacts": [
    {
      "Мобильный телефон": "+7 (985) 186-35-64"
    },
    {
      "Эл. почта": "nikitaatamanuk21@gmail.com"
    }
  ]
};

console.log('Phone:', getNestedValue(testData, 'contacts[0]["Мобильный телефон"]'));
*/

//-------------------------------------------






/*const getNestedValue = (obj: any, path: string) => {
  return path
    .split(/[\.\[\]"]+/) // Split on dots or brackets, ignoring quotes
    .filter(Boolean) // Remove any empty strings from the array
    .reduce((acc, part) => acc && acc[part], obj);
};*/ //!!!more complex  - if russian with space


/*
function generateFilterOptions(data: any[], fields: string[]) {
  return fields.reduce((acc, field) => {
    const uniqueValues = TableUtils.getUniqueValues(data, field)
      .filter((value) => value)
      .map((value) => ({
        value,
        label: value || "Не указано"
      }));
    
    const key = field.split('.').pop(); // Use the last part of the field as the key (e.g., "org_unit" from "job_profile.org_unit")
    acc[key as string] = uniqueValues;
    
    return acc;
  }, {} as Record<string, { value: string; label: string }[]>);
}

Step 2: Use it in your component
You can now call this function inside your useMemo to dynamically generate filter options:

const filterOptions = React.useMemo(() => {
  if (!data) return {};

  const fields = ["job_profile.org_unit", "criteria.speciality", "name"]; // Add any additional fields you want filters for
  return generateFilterOptions(data, fields);
}, [data]);


How it works:
fields.reduce: Loops over the array of field names, and for each field, it gets the unique values, filters them, and formats them into objects with value and label.
field.split('.').pop(): Uses the last part of the field as the key for the filter (for example, "org_unit" from "job_profile.org_unit"). This keeps the filter names short and readable.
DRY principle: Now, whenever you need to add or remove filters for a page, you just modify the fields array without duplicating code.

*/
