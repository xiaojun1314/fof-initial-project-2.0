import React from 'react';
import { Tree } from 'antd';

const { DirectoryTree } = Tree;

export interface ModuleTreeListProps {
   treeData: any,
   handleOnSelectModuleTree: (selectedKeys: React.Key[],info: any) => void;
   loopIconItem: any
}

 const ModuleTreeList: React.FC<ModuleTreeListProps> = (props) => {
  const { treeData,loopIconItem } = props;
  return (
    <div>
      {treeData!==undefined&&treeData.length>0&&(
        <DirectoryTree
          defaultExpandAll
          autoExpandParent={true}
          onSelect={(selectedKeys: React.Key[],info: any) => props.handleOnSelectModuleTree(selectedKeys,info)}
          treeData={loopIconItem(treeData)}
        >
        </DirectoryTree>
      )
      }
    </div>
  );
};
export default ModuleTreeList;

