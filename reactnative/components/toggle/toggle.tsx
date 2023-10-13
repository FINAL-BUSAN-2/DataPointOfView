import React, {Fragment} from 'react';
import {View, Text, Switch} from 'react-native';
import {ToggleProps, styles} from './toggle.objects';

export const Toggle: React.FC<ToggleProps> = ({
  label,
  value,
  onChange,
  children,
}) => {
  return (
    <Fragment>
      <View style={styles.notificationcontainer}>
        <Text style={styles.notification}>{label}</Text>
        <View style={styles.notificationswitch}>
          <Switch
            value={value}
            onValueChange={onChange}
            style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
          />
        </View>
      </View>
      {children}
    </Fragment>
  );
};
