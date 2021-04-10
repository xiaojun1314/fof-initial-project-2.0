import React from 'react';
import { Tree } from 'antd';

const { DirectoryTree } = Tree;

export interface ModuleTreeListProps {
   treeData: any,
   handleOnSelectTree: (selectedKeys: React.Key[],info: any) => void;
   loopIconItem: any
}

 const ModuleTreeList: React.FC<ModuleTreeListProps> = (props) => {

  const { treeData,handleOnSelectTree,loopIconItem } = props;

  return (
    <div>
      {treeData.length>0&&(
        <DirectoryTree
          defaultExpandAll
          autoExpandParent={true}
          onSelect={(selectedKeys: React.Key[],info: any) => handleOnSelectTree(selectedKeys,info)}
          treeData={loopIconItem(treeData)}
        >
        </DirectoryTree>
      )
      }
    </div>
  );
};
 export default ModuleTreeList;

