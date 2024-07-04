//go:build linux
// +build linux

package main

import (
	"os/exec"
)

func configureCmd(cmd *exec.Cmd) {
	// no-op
}

// FlashWindow not implemented
func FlashWindow(_ string) bool {
	return true
}
