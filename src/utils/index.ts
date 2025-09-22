/**
 * Utility functions for the Smart Content Aggregator API
 */

/**
 * Masks sensitive information in database connection strings
 * @param uri - The database connection string
 * @returns Masked connection string
 */
export function maskDatabaseUri(uri: string): string {
  if (!uri) return 'Not configured';
  
  try {
    // Handle MongoDB Atlas URIs with credentials
    if (uri.includes('mongodb+srv://') || uri.includes('mongodb://')) {
      // Extract the protocol
      const protocol = uri.startsWith('mongodb+srv://') ? 'mongodb+srv://' : 'mongodb://';
      
      // Check if URI contains credentials
      const hasCredentials = uri.includes('@');
      
      if (hasCredentials) {
        // Split by @ to separate credentials from host
        const parts = uri.split('@');
        if (parts.length >= 2) {
          const hostPart = parts[1];
          if (hostPart) {
            // Extract database name if present
            const dbMatch = hostPart.match(/\/([^?]+)/);
            const dbName = dbMatch ? dbMatch[1] : '';
            
            // Extract host (before the slash or query params)
            const hostMatch = hostPart.match(/^([^/?]+)/);
            const host = hostMatch ? hostMatch[1] : hostPart.split('/')[0];
            
            return `${protocol}***:***@${host}${dbName ? `/${dbName}` : ''}`;
          }
        }
      } else {
        // No credentials, just return as is (local MongoDB)
        return uri;
      }
    }
    
    // Fallback for other database types
    return uri.replace(/\/\/[^@]+@/, '//***:***@');
  } catch (error) {
    return 'Database connection configured';
  }
}

/**
 * Gets database connection status and type
 * @param uri - The database connection string
 * @returns Database info object
 */
export function getDatabaseInfo(uri: string): { type: string; status: string; masked: string } {
  const masked = maskDatabaseUri(uri);
  
  let type = 'Unknown';
  if (uri.includes('mongodb+srv://')) {
    type = 'MongoDB Atlas';
  } else if (uri.includes('mongodb://')) {
    type = uri.includes('localhost') ? 'MongoDB Local' : 'MongoDB';
  }
  
  return {
    type,
    status: 'Connected',
    masked
  };
}

/**
 * Formats environment information for console output
 * @param env - Environment name
 * @returns Formatted environment string with appropriate emoji
 */
export function formatEnvironment(env: string): string {
  switch (env.toLowerCase()) {
    case 'production':
      return '🚀 Production';
    case 'staging':
      return '🧪 Staging';
    case 'test':
      return '🔬 Test';
    case 'development':
    default:
      return '🛠️  Development';
  }
}

/**
 * Validates if a string looks like a database connection URI
 * @param uri - String to validate
 * @returns Boolean indicating if it looks like a valid URI
 */
export function isValidDatabaseUri(uri: string): boolean {
  if (!uri || typeof uri !== 'string') return false;
  
  const validPrefixes = [
    'mongodb://',
    'mongodb+srv://',
    'postgresql://',
    'mysql://',
    'sqlite:'
  ];
  
  return validPrefixes.some(prefix => uri.startsWith(prefix));
}