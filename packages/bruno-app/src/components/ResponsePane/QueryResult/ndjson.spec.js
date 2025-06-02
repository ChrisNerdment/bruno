// Test the NDJSON helper functions directly
// These are the same functions used in the QueryResult component

const isNDJSON = (content) => {
  if (!content || typeof content !== 'string') {
    return false;
  }
  
  const lines = content.split('\n').filter(line => line.trim());
  
  // Must have at least 2 lines to be NDJSON
  if (lines.length < 2) {
    return false;
  }
  
  // Each line should be valid JSON
  return lines.every(line => {
    try {
      JSON.parse(line.trim());
      return true;
    } catch {
      return false;
    }
  });
};

const formatNDJSON = (content) => {
  const lines = content.split('\n').filter(line => line.trim());
  
  return lines.map(line => {
    try {
      const parsed = JSON.parse(line.trim());
      return JSON.stringify(parsed, null, 2);
    } catch {
      return line;
    }
  }).join('\n\n');
};

describe('NDJSON formatting', () => {
  describe('isNDJSON', () => {
    it('should detect valid NDJSON content', () => {
      const ndjsonContent = '{"title":"example1","id":1}\n{"title":"example2","id":2}';
      expect(isNDJSON(ndjsonContent)).toBe(true);
    });

    it('should not detect regular JSON as NDJSON', () => {
      const jsonContent = '{"items":[{"title":"example1","id":1},{"title":"example2","id":2}]}';
      expect(isNDJSON(jsonContent)).toBe(false);
    });

    it('should not detect single line as NDJSON', () => {
      const singleLine = '{"title":"example1","id":1}';
      expect(isNDJSON(singleLine)).toBe(false);
    });

    it('should not detect invalid JSON lines as NDJSON', () => {
      const invalidContent = '{"title":"example1","id":1}\ninvalid json line';
      expect(isNDJSON(invalidContent)).toBe(false);
    });

    it('should handle empty or null content', () => {
      expect(isNDJSON('')).toBe(false);
      expect(isNDJSON(null)).toBe(false);
      expect(isNDJSON(undefined)).toBe(false);
    });
  });

  describe('formatNDJSON', () => {
    it('should format NDJSON content with proper indentation', () => {
      const ndjsonContent = '{"title":"example1","id":1}\n{"title":"example2","id":2}';
      const result = formatNDJSON(ndjsonContent);
      
      const expectedResult = `{
  "title": "example1",
  "id": 1
}

{
  "title": "example2",
  "id": 2
}`;
      
      expect(result).toBe(expectedResult);
    });

    it('should handle complex nested objects', () => {
      const ndjsonContent = '{"user":{"name":"John","age":30}}\n{"user":{"name":"Jane","age":25}}';
      const result = formatNDJSON(ndjsonContent);
      
      const expectedResult = `{
  "user": {
    "name": "John",
    "age": 30
  }
}

{
  "user": {
    "name": "Jane",
    "age": 25
  }
}`;
      
      expect(result).toBe(expectedResult);
    });

    it('should filter out empty lines', () => {
      const ndjsonContent = '{"title":"example1","id":1}\n\n{"title":"example2","id":2}\n';
      const result = formatNDJSON(ndjsonContent);
      
      const expectedResult = `{
  "title": "example1",
  "id": 1
}

{
  "title": "example2",
  "id": 2
}`;
      
      expect(result).toBe(expectedResult);
    });
  });
});