import {ReactNode} from 'react';
import {StyleSheet} from 'react-native';

export interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  children?: ReactNode | undefined;
}

export const styles = StyleSheet.create({
  /// 알람 설정
  notificationcontainer: {
    marginTop: 0,
    width: 360,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between', // 수직 가운데 정렬
    alignItems: 'center',
    marginBottom: 10,
  },
  notification: {
    marginLeft: 50,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
  },
  notificationswitch: {
    marginRight: 50,
  },
});
