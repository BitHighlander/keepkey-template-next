import React from 'react';
import { Image, keyframes, usePrefersReducedMotion } from '@chakra-ui/react';
import logo from './assets/cacao.png';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Logo = props => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 20s linear`;

  return                            <Image
      animation={animation}
      src={"/maya.jpg"}
      alt="Maya Logo"
      width={200}
      height={200}
      style={{
        borderRadius: "50%",

      }}
  />;
};
