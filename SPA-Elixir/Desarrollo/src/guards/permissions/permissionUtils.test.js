import test from 'node:test';
import assert from 'node:assert/strict';
import { extractPermissionsFromTokenPayload } from './permissionUtils.js';

test('extractPermissionsFromTokenPayload collects permissions from multiple claim shapes', () => {
  const payload = {
    permission: ['PACIENTE_VER', 'PRODUCTO_VER'],
    permissions: 'FACTURA_VER',
    permiso: ['USUARIO_VER', 'USUARIO_VER'],
    roles: ['Admin', 'Optometrista'],
  };

  const permissions = extractPermissionsFromTokenPayload(payload);

  assert.deepEqual(permissions, ['PACIENTE_VER', 'PRODUCTO_VER', 'FACTURA_VER', 'USUARIO_VER']);
});
