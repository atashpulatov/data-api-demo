class _MstrObjectType {
  // TODO: Add support for documents

  mstrObjectType = {
    folder: {
      type: 8,
      subtypes: [2048],
      name: 'folder',
      request: 'folders',
    },
    report: {
      type: 3,
      subtypes: [768, 769, 774],
      name: 'report',
      request: 'reports',
    },
    dataset: {
      type: 3,
      subtypes: [776, 779],
      name: 'dataset',
      request: 'cubes',
    },
    dossier: {
      type: 55,
      subtypes: [14081],
      name: 'dossier',
      request: 'dossiers',
    },
    visualization: {
      // TODO: Change string to proper type and subtype of visualization
      type: 'undefined',
      subtypes: 'undefined',
      name: 'visualization',
      request: 'visualizations',
    },
  };

  getMstrTypeBySubtype = (objectSubtype) => Object.values(this.mstrObjectType).find(
    (type) => type.subtypes.indexOf(objectSubtype) !== -1,
  );

  getMstrTypeByName = (typeName) => {
    let checkedType;
    if (typeName.name) {
      checkedType = typeName.name;
    } else {
      checkedType = typeName;
    }
    return Object.values(this.mstrObjectType).find(
      (type) => type.name === checkedType.toLowerCase(),
    );
  };
}

const MstrObjectType = new _MstrObjectType();
export default MstrObjectType;
