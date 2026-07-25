export const storageRegistryService = {
  registry: [
    { key: 'bsai_analytics_store', module: 'analytics', schemaVersionKey: 'bsai_analytics_schema_version' },
    { key: 'bsai_csc_store', module: 'csc', schemaVersionKey: 'bsai_csc_schema_version' },
    { key: 'bsai_security_events', module: 'security', schemaVersionKey: 'bsai_security_schema_version' }
  ],

  getStorageRegistry() {
    return this.registry;
  },

  getStorageUsageSummary() {
    return this.registry.map(reg => {
      const data = localStorage.getItem(reg.key);
      const sizeKB = data ? (new Blob([data]).size / 1024).toFixed(2) : 0;
      return {
        ...reg,
        sizeKB
      };
    });
  },
  
  validateAllStorage() {
    const health = [];
    for (const reg of this.registry) {
       const data = localStorage.getItem(reg.key);
       if (data) {
          try {
             JSON.parse(data);
             health.push({ key: reg.key, status: 'healthy' });
          } catch (e) {
             health.push({ key: reg.key, status: 'corrupted' });
          }
       } else {
         health.push({ key: reg.key, status: 'empty' });
       }
    }
    return health;
  }
};
