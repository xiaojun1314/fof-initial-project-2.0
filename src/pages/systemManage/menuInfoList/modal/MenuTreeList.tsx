import React from 'react';
import { Tree } from 'antd';

const { DirectoryTree } = Tree;

export interface MenuTreeListProps {
   treeData: any,
   handleOnSelectMenuTree: (selectedKeys: React.Key[],info: any) => void;
   loopIconItem: any
}

 const MenuTreeList: React.FC<MenuTreeListProps> = (props) => {
  const { treeData,loopIconItem } = props;
  return (
    <div>
      {treeData!==undefined&&treeData.length>0&&(
        <DirectoryTree
          defaultExpandAll
          autoExpandParent={true}
          onSelect={(selectedKeys: React.Key[],info: any) => props.handleOnSelectMenuTree(selectedKeys,info)}
          treeData={loopIconItem(treeData)}
        >
        </DirectoryTree>
      )
      }
    </div>
  );
};
export default MenuTreeList;

