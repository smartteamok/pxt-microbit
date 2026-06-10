// Minimal ambient declarations for editor internals SmartTeam touches but that
// are not part of the public typings. Access is always runtime-guarded
// (typeof checks + try/catch) so an undefined value degrades to a no-op.

// pxt-core's package manager namespace, available in the editor webapp.
declare const pkg: any;
