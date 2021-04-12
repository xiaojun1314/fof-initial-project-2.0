import {DashboardOutlined,DesktopOutlined,ApartmentOutlined,ClusterOutlined, AccountBookOutlined,
  AimOutlined, AlertOutlined,AppstoreAddOutlined,
  AudioOutlined, AudioMutedOutlined, AuditOutlined, BankOutlined, BarcodeOutlined, BarsOutlined, BellOutlined, BlockOutlined, BorderOutlined,
  BorderlessTableOutlined, BranchesOutlined, BugOutlined, BuildOutlined, BulbOutlined, CalculatorOutlined, CalendarOutlined, CameraOutlined, CarOutlined, CarryOutOutlined, CiCircleOutlined,
  CiOutlined, ClearOutlined, CloudDownloadOutlined, CloudOutlined, CloudServerOutlined, CloudSyncOutlined, CloudUploadOutlined, CodeOutlined, CoffeeOutlined,
  CommentOutlined, CompassOutlined, CompressOutlined, ConsoleSqlOutlined, ContactsOutlined, ContainerOutlined, ControlOutlined, CopyrightOutlined, CreditCardOutlined,
  CrownOutlined, CustomerServiceOutlined, DatabaseOutlined, DeleteColumnOutlined, DeleteRowOutlined,
  DeliveredProcedureOutlined, DeploymentUnitOutlined,DingtalkOutlined, DisconnectOutlined,
  DislikeOutlined, DollarCircleOutlined, DownloadOutlined, EllipsisOutlined, EnvironmentOutlined, EuroCircleOutlined,DropboxOutlined,
  ExceptionOutlined, ExpandAltOutlined, ExpandOutlined, ExperimentOutlined, ExportOutlined, EyeOutlined, EyeInvisibleOutlined, FieldStringOutlined, FieldBinaryOutlined, FieldNumberOutlined,UserOutlined,TeamOutlined} from '@ant-design/icons';

export  const IconMenuMap = {
  AccountBookOutlined,
  AimOutlined,
  AlertOutlined,
  ApartmentOutlined,
  AppstoreAddOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  AuditOutlined,
  BankOutlined,
  BarcodeOutlined,
  BarsOutlined,
  BellOutlined,
  BlockOutlined,
  BorderOutlined,
  BorderlessTableOutlined,
  BranchesOutlined,
  BugOutlined,
  BuildOutlined,
  BulbOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CameraOutlined,
  CarOutlined,
  CarryOutOutlined,
  CiCircleOutlined,
  CiOutlined,
  ClearOutlined,
  CloudDownloadOutlined,
  CloudOutlined,
  CloudServerOutlined,
  CloudSyncOutlined,
  CloudUploadOutlined,
  ClusterOutlined,
  CodeOutlined,
  CoffeeOutlined,
  CommentOutlined,
  CompassOutlined,
  CompressOutlined,
  ConsoleSqlOutlined,
  ContactsOutlined,
  ContainerOutlined,
  ControlOutlined,
  CopyrightOutlined,
  CreditCardOutlined,
  CrownOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DeleteColumnOutlined,
  DeleteRowOutlined,
  DeliveredProcedureOutlined,
  DeploymentUnitOutlined,
  DesktopOutlined,
  DingtalkOutlined,
  DisconnectOutlined,
  DislikeOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  EnvironmentOutlined,
  EuroCircleOutlined,
  ExceptionOutlined,
  ExpandAltOutlined,
  ExpandOutlined,
  ExperimentOutlined,
  ExportOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FieldStringOutlined,
  FieldBinaryOutlined,
  FieldNumberOutlined,
DropboxOutlined,
UserOutlined,
TeamOutlined
}

export const loopMenuRoutesItem = (routes: any) =>{
  if (routes !== undefined) {
    return routes.map(({icon, routes, ...item}) => {
      const Icon = IconMenuMap[icon];
      return {
        ...item,
        icon: icon && <Icon />,
        routes: routes && loopMenuRoutesItem(routes),
      }
    });

  }
  return true;
};

export const loopIconItem = (treeData: any) =>{
  if (treeData !== undefined) {
    return treeData.map(({icon, treeData, ...item}) => {
    const Icon = IconMenuMap[icon];
      return {
      ...item,
      icon: icon && <Icon />,
      routes: treeData && loopIconItem(treeData),
    }
    });
  }
  return true;
};


export  const IconMenuMap1 = {
  "AccountBookOutlined":AccountBookOutlined,
}
